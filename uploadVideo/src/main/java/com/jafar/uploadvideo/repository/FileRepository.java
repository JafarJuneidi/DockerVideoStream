package com.jafar.uploadvideo.repository;

import com.jafar.uploadvideo.models.File;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FileRepository extends JpaRepository<File, Long> {
}
