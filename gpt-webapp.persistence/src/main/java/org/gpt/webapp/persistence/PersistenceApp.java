package org.gpt.webapp.persistence;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "org.gpt.webapp.persistence")
@EnableJpaRepositories(basePackages = "org.gpt.webapp.persistence.repositories")
@EntityScan(basePackages = "org.gpt.webapp.persistence.entities")
public class PersistenceApp {
  public static void main(String[] args) {
	  SpringApplication.run(PersistenceApp.class, args);
  }
}
