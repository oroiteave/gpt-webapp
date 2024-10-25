package org.gpt.webapp.web.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordSecurityEncoder {

	@Autowired
	PasswordEncoder passwordEncoder;
	
	public boolean checkPassword(String rawPassword, String encodedPassword) {
		return passwordEncoder.matches(rawPassword, encodedPassword);
	}
	public String encoder(String rawPassword) {
		return passwordEncoder.encode(rawPassword);
	}
}
