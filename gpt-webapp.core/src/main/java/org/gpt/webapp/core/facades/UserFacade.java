package org.gpt.webapp.core.facades;

import java.util.List;
import java.util.Optional;

import org.gpt.webapp.persistence.entities.User;

public interface UserFacade {
	void saveUser(User user);
	Optional<User>getUserById(Long userId);
	Optional<User>getUserByUserName(String userName);
	Optional<User> getUserByEmail(String email);
	List<User>getUsers();
}
