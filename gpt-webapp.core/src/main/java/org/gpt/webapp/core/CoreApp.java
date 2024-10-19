package org.gpt.webapp.core;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"org.gpt.webapp.core", "org.gpt.webapp.persistence"})
public class CoreApp {
  public static void main(String[] args) {
	  SpringApplication.run(CoreApp.class, args);
  }
}
