package org.example.tula.minio.util;

import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public final class PathUtil {

    private PathUtil() {
        // Utility class
    }

    /**
     * Builds an object path in MinIO with the pattern: {module}/{uuid}_{originalFilename}
     * @param module   module name (e.g., "avatars")
     * @param file     uploaded file to extract original name
     * @return full path string
     */
    public static String buildPath(String module, MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uniqueName = UUID.randomUUID().toString() + extension;
        return String.format("%s/%s", module, uniqueName);
    }
}
