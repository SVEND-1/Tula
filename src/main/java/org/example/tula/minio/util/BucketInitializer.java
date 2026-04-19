package org.example.tula.minio.util;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.tula.minio.config.MinioConfig;
import org.example.tula.minio.exceptions.MinioServiceException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class BucketInitializer {

    private final MinioClient minioClient;
    private final MinioConfig minioConfig;

    @PostConstruct
    public void initBuckets() {
        minioConfig.getBuckets().values().forEach(bucketName -> {
            try {
                boolean exists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
                if (!exists) {
                    minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
                    log.info("Bucket '{}' created successfully", bucketName);
                }
            } catch (Exception e) {
                log.error("Could not initialize bucket '{}'", bucketName, e);
                throw new MinioServiceException("Bucket initialization failed", e);
            }
        });
    }
}
