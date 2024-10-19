package org.gpt.webapp.core.facades.impl;

import java.util.Optional;

import org.gpt.webapp.core.facades.UserFacade;
import org.gpt.webapp.persistence.entities.User;
import org.gpt.webapp.persistence.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DefaultUserFacade implements UserFacade{
	
	@Autowired
	private UserRepository userRepository;
	
	@Override
	public void saveUser(User user) {
		userRepository.save(user);
	}

	@Override
	public Optional<User> getUserById(Long userId) {
		return userRepository.findById(userId);
	}

	@Override
	public Optional<User> getUserByUserName(String userName) {
		return userRepository.findByUsername(userName);
	}

	@Override
	public Optional<User> getUserByEmail(String email) {
		return userRepository.findByEmail(email);
	}
}