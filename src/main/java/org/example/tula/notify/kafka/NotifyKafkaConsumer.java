package org.example.tula.notify.kafka;

import org.example.tula.notify.EmailSenderService;
import org.example.tula.notify.event.NotifyEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class NotifyKafkaConsumer {
    private final EmailSenderService emailSenderService;

    public NotifyKafkaConsumer(EmailSenderService emailSenderService) {
        this.emailSenderService = emailSenderService;
    }

    @KafkaListener(topics = "notifyUser")
    public void consumeNotify(NotifyEvent event) {
        emailSenderService.sendEmail(event);
    }
}
