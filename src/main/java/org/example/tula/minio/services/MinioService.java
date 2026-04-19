package org.example.tula.minio.services;

import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
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
     * @return generated object path in MinIO
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

        try(InputStream inputStream = file.getInputStream()) {
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
     * Downloads a file from MinIO as InputStream.
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
}
