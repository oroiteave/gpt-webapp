package org.gpt.webapp.web;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;

@SpringBootApplication
@ComponentScan(basePackages = {"org.gpt.webapp.core", "org.gpt.webapp.web", "org.gpt.webapp.persistence"})
@PropertySource("classpath:api.keys.properties")
public class WebApp {
	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(WebApp.class);
		app.setAdditionalProfiles("dev");
		app.run(args);
	}
}