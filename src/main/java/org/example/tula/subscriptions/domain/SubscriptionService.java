package org.example.tula.subscriptions.domain;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.tula.payments.api.dto.response.payment.PaymentResponse;
import org.example.tula.payments.db.PaymentEntity;
import org.example.tula.payments.domain.PaymentService;
import org.example.tula.subscriptions.api.dto.response.SubscriptionDetailResponse;
import org.example.tula.subscriptions.api.exception.SubscriptionOwnershipException;
import org.example.tula.subscriptions.db.Status;
import org.example.tula.subscriptions.db.SubscriptionEntity;
import org.example.tula.subscriptions.db.SubscriptionRepository;
import org.example.tula.users.db.UserEntity;
import org.example.tula.users.domain.UserService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionService {
    private final PaymentService paymentService;
    private final SubscriptionRepository subscriptionRepository;
    private final UserService userService;

    //====================================CONTROLLER METHODS=======================================================

    public SubscriptionDetailResponse getSubscription(Long id) {
        if (id == null) {
            return null;
        }
        SubscriptionEntity sub = subscriptionRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Подписка не найдена"));

        if(!sub.getUser().getId().equals(userService.getCurrentUser().getId())){
            log.warn("Пользователь не является владельцем подписки");
            throw new SubscriptionOwnershipException("Пользователь не является владельцем подписки");
        }

        String endDate =
                sub.getEndDate().getDayOfMonth() + " " +
                switchMonthTranslationInRussian(sub.getEndDate().getMonth())  + " " +
                sub.getEndDate().getYear() + "г.";

        return new SubscriptionDetailResponse(
                sub.getActive().name(),
                endDate
        );
    }

    @Transactional
    public String createSubscription(String paymentId) {
        try {
            PaymentEntity payment = paymentService.findByPaymentId(paymentId);

            String validationError = validateSubscription(paymentId,payment.getUse());
            if (validationError != null) {
                return validationError;
            }

            UserEntity user = userService.getCurrentUser();
            Optional<SubscriptionEntity> optionalSub = subscriptionRepository
                    .findByUserEmail(user.getEmail());

            SubscriptionEntity sub = optionalSub.orElseGet(() ->
                    SubscriptionEntity.builder().user(user).build());

            sub.setActive(Status.ACTIVE);
            sub.setPaymentId(paymentId);
            sub.setEndDate(LocalDateTime.now().plusMinutes(3));
            subscriptionRepository.save(sub);

            payment.setUse(true);
            paymentService.save(payment);

            return "Успешно";
        }catch (Exception e){
            log.error("Не удалось оформить подписку,paymentId={},ex={}",paymentId,e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    //====================================SERVICE METHODS=======================================================

    public SubscriptionEntity findByUserEmail(String userEmail) {
        return subscriptionRepository.findByUserEmail(userEmail).orElse(null);
    }

    //@Scheduled(cron = "0 0 0 * * *") раз в день //TODO в проде это поставить
    //@Scheduled(cron = "0 * * * * *") минута
    @Scheduled(fixedDelay = 1800000)//Каждые 30 минут
    public void checkExpiredSubscriptions(){//Сделать фильтр при загрузки из бд
        subscriptionRepository.findAllByActive(Status.ACTIVE)
                .stream()
                .filter(el -> el.getEndDate().getMonth() == LocalDate.now().getMonth() &&
                        el.getEndDate().getDayOfMonth() == LocalDate.now().getDayOfMonth())//если делать подписку на год добавить проверку
                .forEach(sub -> {
                    sub.setActive(Status.BLOCKED);
                    subscriptionRepository.save(sub);
                });
    }

    private String validateSubscription(String paymentId,Boolean use) {
        if (paymentId == null || paymentId.trim().isEmpty()) {
            return "Неверный paymentId";
        }
        paymentService.isValidUser(paymentId);

        PaymentResponse payment = paymentService.findPaymentDto(paymentId);
        if (!"succeeded".equals(payment.status())) {
            return "Платёж не прошёл";
        }

        UserEntity user = userService.getCurrentUser();
        Optional<SubscriptionEntity> optionalSub = subscriptionRepository
                .findByUserEmail(user.getEmail());

        if (optionalSub.isPresent()) {
            SubscriptionEntity sub = optionalSub.get();
            if (Status.ACTIVE.equals(sub.getActive())
                    && sub.getEndDate() != null
                    && sub.getEndDate().isAfter(LocalDateTime.now())) {
                return "Подписка уже активна до " + sub.getEndDate();
            }

            if(sub.getPaymentId().equals(paymentId)) {
                return "Этот платеж уже был использован для оплаты";
            }
        }

        if(use){
            return "Данным платеж уже был использован";
        }

        return null;
    }

    private String switchMonthTranslationInRussian(Month month) {//возможно перенести на фронтенд
        switch (month) {
            case JANUARY:
                return "января";
            case FEBRUARY:
                return "февраля";
            case MARCH:
                return "марта";
            case APRIL:
                return "апреля";
            case MAY:
                return "мая";
            case JUNE:
                return "июня";
            case JULY:
                return "июля";
            case AUGUST:
                return "августа";
            case SEPTEMBER:
                return "сентября";
            case OCTOBER:
                return "октября";
            case NOVEMBER:
                return "ноября";
            case DECEMBER:
                return "декабря";
            default:
                return "месяц не указан";
        }
    }


}
