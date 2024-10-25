package org.gpt.webapp.web.controllers;

import java.io.IOException;

import org.gpt.webapp.core.facades.UserFacade;
import org.gpt.webapp.persistence.entities.User;
import org.gpt.webapp.web.utils.PasswordSecurityEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/user")
public class UserController {
	private static final String LOGGED_IN_USER_ATTR = "loggedInUser";
	
	@Autowired
	private PasswordSecurityEncoder passwordSecurityEncoder;
	
	@Autowired
	private UserFacade userFacade;
	
	@GetMapping("current")
	public ResponseEntity<User> getUser(HttpSession session) {
		User user = (session != null) ? ((User) session.getAttribute(LOGGED_IN_USER_ATTR)) : null;
		return ResponseEntity.ok(user);
	} 
	
	@PostMapping("/register")
	public void register(HttpServletResponse response, HttpSession session, @RequestParam String email, @RequestParam String userName, @RequestParam String password, @RequestParam String confirmPassword) throws IOException {
		User user = new User();
		user.setEmail(email);
		user.setPassword(password);
		user.setUserName(userName);
		String validateMessage = validateRegister(user,confirmPassword);
		
		if(validateMessage!=null) {
        	session.setAttribute("errorMessage", validateMessage);
        	response.sendRedirect("/sign-up.html");
        	return;
        }
		
		user.setPassword(passwordSecurityEncoder.encoder(password));
		userFacade.saveUser(user);
		response.sendRedirect("/sign-in.html");
	}
	
	@PutMapping("/token")
	public void setToken(HttpSession session,@RequestParam String userToken) {
		User user = ((User) session.getAttribute(LOGGED_IN_USER_ATTR));
		user.setToken(userToken);
		userFacade.saveUser(user);
	}
	
	@GetMapping("/token")
	public String getToken(HttpSession session) {
		User user = ((User) session.getAttribute(LOGGED_IN_USER_ATTR));
		String token = user.getToken();
		return (token != null) ? token : null;  
	}
	
	private String validateRegister(User user, String confirmPassword) {
		if(!validatePassword(user.getPassword())) {
        	return "La contraseña debe tener entre 8 y 44 caracteres, y debe incluir al menos un carácter especial.";
        }
		
		if(!user.getPassword().equals(confirmPassword)) {
        	return "La contraseña de confirmación no coincide, por favor intente de nuevo.";
        }
		
		if(userFacade.getUserByEmail(user.getEmail()).isPresent()) {
        	return "El email ya está registrado, por favor intenta con otro email.";
        }
		
		return null;
	}
	
	private boolean validatePassword(String password) {
		
		if (password.length() <= 8 || password.length() >= 44) {
            return false;
        }
        
        String specialCharacters = "[.,!@#$%^&*()_+=|<>?{}\\[\\]~-]";
        
        for (char c : password.toCharArray()) {
            if (String.valueOf(c).matches(specialCharacters)) {
                return true;
            }
        }
		return false;
	}
}
