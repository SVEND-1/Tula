package org.example.tula.notify;

import lombok.extern.slf4j.Slf4j;
import org.example.tula.notify.event.NotifyType;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
public class EmailTemplateService {

    public String getSubject(NotifyType type, Map<String, String> params) {
        if (type == null || params == null) {
            return "Уведомление от Tula Hackaton";
        }

        return switch (type) {
            case REGISTER -> String.format("Tula Hackaton: Ваш код для входа [%s]",
                    params.getOrDefault("code", ""));
            case PASSWORD_RESET -> String.format("Tula Hackaton: Сброс пароля [%s]",
                    params.getOrDefault("code", ""));
            case REPLAY_CODE -> String.format("Hackaton: Повторный код [%s]",
                    params.getOrDefault("code", ""));
            case LOGIN -> "Tula Hackaton: Вход в аккаунт";
            case LIKE -> "Вашего питомца хотят взять";

            default -> "Уведомление от Tula Hackaton";
        };
    }

    public String getContent(NotifyType type, Map<String, String> params) {
        if (type == null || params == null) {
            return "";
        }

        return switch (type) {
            case REGISTER -> String.format("""
                Добро пожаловать в Tula Hackaton!
                
                Ваш код для входа: %s
                
                Введите этот код на странице подтверждения для завершения входа в ваш аккаунт.
                
                Если вы не запрашивали вход, пожалуйста, проигнорируйте это письмо.
                
                С уважением,
                Команда Tula Hackaton
                """, params.getOrDefault("code", ""));

            case PASSWORD_RESET -> String.format("""
                Запрос на сброс пароля
                
                Ваш код подтверждения: %s
                
                Введите этот код на странице подтверждения для сброса пароля.
                
                Если вы не запрашивали сброс пароля, проигнорируйте это письмо.
                
                С уважением,
                Команда Tula Hackaton
                """, params.getOrDefault("code", ""));

            case REPLAY_CODE -> String.format("""
                Был запрошен повторный код
                
                Ваш повторный код: %s
                
                С уважением,
                Команда Tula Hackaton
                """, params.getOrDefault("code", ""));

            case LOGIN -> String.format("""
                Уважаемый %s,
                
                В ваш аккаунт был выполнен вход.
                
                Если это были не вы, пожалуйста, свяжитесь со службой поддержки.
                
                С уважением,
                Команда Tula Hackaton
                """, params.getOrDefault("userName", ""));

            case LIKE -> String.format("""
                Пользователь %s заинтересовался вашим питомцем %s.
                
                Зайдите в личный кабинет, чтобы ответить.
                
                С уважением,
                Команда Tula Hackaton
                """,
                    params.getOrDefault("userName", "Пользователь"),
                    params.getOrDefault("animalName", "питомцем"));

            default -> "";
        };
    }
}
