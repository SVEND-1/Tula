package org.example.tula.notify.event;

import java.util.Map;

public record NotifyEvent(
        String email,
        Map<String,String> parameters,
        NotifyType type
){
}
