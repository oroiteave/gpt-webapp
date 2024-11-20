package org.gpt.webapp.web;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"org.gpt.webapp.core", "org.gpt.webapp.web", "org.gpt.webapp.persistence"})
public class WebApp {
	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(WebApp.class);
		app.setAdditionalProfiles("dev");
		app.run(args);
	}
}