package org.gpt.webapp.web.filters;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

import org.springframework.stereotype.Component;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;

@Component
public class AuthenticationFilter  implements Filter {
	
	private static final String LOGGED_IN_USER_ATTR = "loggedInUser";
       
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        HttpSession session = httpRequest.getSession(false);

        boolean loggedIn = (session != null && session.getAttribute(LOGGED_IN_USER_ATTR) != null);

        String requestURI = httpRequest.getRequestURI();
        if (!loggedIn && requestURI.endsWith("/index.html")) {
            httpResponse.sendRedirect("/sign-in.html");
            return; 
        }
        chain.doFilter(request, response);
	}
}
