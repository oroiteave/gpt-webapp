package org.gpt.webapp.web.controllers;

import java.io.IOException;

import org.gpt.webapp.core.facades.UserFacade;
import org.gpt.webapp.persistence.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/session")
public class SessionController {
	private static final String LOGGED_IN_USER_ATTR = "loggedInUser";
	@Autowired
	private UserFacade userFacade;
	
	@GetMapping("/errorMessage")
	public String errorMessage(HttpSession session) {
		return (String) session.getAttribute("errorMessage");
	}
	@PostMapping("/logout")
	public void logOut(HttpSession session, HttpServletResponse response) throws IOException{
		if(session != null) {
			session.invalidate();
		}
		response.sendRedirect("/sign-in.html");
	}
	
	@PostMapping("/login")
	public void login(@RequestParam String email,@RequestParam String password, HttpSession session,  HttpServletResponse response) throws IOException {
		User user = userFacade.getUserByEmail(email).get();
		String errorMessage = validateSignIn(user, password);
		
		if(errorMessage!=null) {
			session.setAttribute("errorMessage", errorMessage);
			response.sendRedirect("/sign-in.html");
			return;
		}
		
		session.setAttribute(LOGGED_IN_USER_ATTR, user);
			session.setAttribute("errorMessage", "");
			response.sendRedirect("/index.html");
			return;
	}
	private String validateSignIn(User user,String password) {
		if(user == null) {
			return "No existe un usuario con ese email";
		}
		if(!user.getPassword().equals(password)) {
			return "La contraseña es incorrecta";
		}
		return null;
	}
}
