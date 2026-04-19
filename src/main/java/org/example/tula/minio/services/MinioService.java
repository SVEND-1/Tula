package org.example.tula.minio.services;

import io.minio.*;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.tula.minio.config.MinioConfig;
import org.example.tula.minio.exceptions.MinioServiceException;
import org.example.tula.minio.util.FileValidator;
import org.example.tula.minio.util.PathUtil;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class MinioService {
    private final MinioClient minioClient;
    private final MinioConfig minioConfig;
    private final FileValidator fileValidator;

    /**
     * Uploads a file to a specific bucket.
     *
     * @param moduleKey key from properties (e.g., "user-avatars")
     * @param file      file to upload
     * @return generated object path in MiniO
     */
    public String uploadFile(
            String moduleKey,
            MultipartFile file
    ) {
        fileValidator.validate(file);

        String bucketName = minioConfig.getBuckets().get(moduleKey);
        if (bucketName == null) {
            throw new MinioServiceException("Unknown module key: " + moduleKey);
        }

        String objectPath = PathUtil.buildPath(moduleKey, file);

        try (InputStream inputStream = file.getInputStream()) {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectPath)
                            .stream(inputStream, file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );
            log.info("File uploaded successfully to bucket {} with path {}", bucketName, objectPath);
            return objectPath;
        } catch (Exception e) {
            log.error("Failed to upload file", e);
            throw new MinioServiceException("Failed to upload file: " + e.getMessage(), e);
        }
    }

    /**
     * Downloads a file from Minio as InputStream.
     *
     * @param moduleKey  key from properties (e.g., "user-avatars")
     * @param objectPath full path of the object in the bucket
     * @return InputStream of the file content
     */
    public InputStream getFile(String moduleKey, String objectPath) {
        String bucketName = minioConfig.getBuckets().get(moduleKey);
        if (bucketName == null) {
            throw new MinioServiceException("Unknown module key: " + moduleKey);
        }

        try {
            return minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectPath)
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to retrieve file", e);
            throw new MinioServiceException("Could not get file: " + e.getMessage(), e);
        }
    }

    /**
     * Generates presigned url.
     *
     * @param moduleKey     key from properties (e.g., "user-avatars")
     * @param objectPath    full path of the object in the bucket
     * @param expirySeconds how much url will be live
     * @return String URL of the file
     */
    public String generatePresignedUrl(String moduleKey, String objectPath, int expirySeconds) {
        String bucketName = minioConfig.getBuckets().get(moduleKey);

        try {
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .bucket(bucketName)
                            .object(objectPath)
                            .method(Method.GET)
                            .expiry(expirySeconds)
                            .build()
            );
        } catch (Exception e) {
            throw new MinioServiceException("Failed to generate presigned URL", e);
        }
    }

    /**
     * Deletes file from Minio.
     *
     * @param moduleKey  key from properties (e.g., "user-avatars")
     * @param objectPath full path of the object in the bucket
     */
    public void deleteFile(String moduleKey, String objectPath) {
        String bucketName = minioConfig.getBuckets().get(moduleKey);
        if (bucketName == null) {
            throw new MinioServiceException("Unknown module key: " + moduleKey);
        }

        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectPath)
                            .build()
            );
            log.info("File deleted from bucket '{}', path '{}'", bucketName, objectPath);
        } catch (Exception e) {
            log.error("Failed to delete file from MiniO", e);
            throw new MinioServiceException("Could not delete file: " + e.getMessage(), e);
        }
    }
}
