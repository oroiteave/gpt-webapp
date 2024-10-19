package org.gpt.webapp.persistence.respositories;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Optional;

import org.gpt.webapp.persistence.entities.User;
import org.gpt.webapp.persistence.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
@DataJpaTest
public class UserRepositoryTest {

	@Autowired
	private UserRepository userRepository;
	
	private User testUser;
	
	@BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setEmail("test@example.com");
        testUser.setPassword("password");
        testUser.setUserName("testUser");
        testUser.setToken("testToken");
        userRepository.save(testUser);
    }
	
	@Test
	public void testSaveUser() {
        Optional<User> foundUser = userRepository.findById(testUser.getId());
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getUserName()).isEqualTo("testUser");
        assertThat(foundUser.get().getEmail()).isEqualTo("test@example.com");
        assertThat(foundUser.get().getPassword()).isEqualTo("password");
        assertThat(foundUser.get().getToken()).isEqualTo("testToken");
	}
	
	@Test
	public void testShouldFindByUserName() {
        Optional<User> foundUser = userRepository.findByUsername("testUser");
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getUserName()).isEqualTo("testUser");
        assertThat(foundUser.get().getEmail()).isEqualTo("test@example.com");
        assertThat(foundUser.get().getPassword()).isEqualTo("password");
        assertThat(foundUser.get().getToken()).isEqualTo("testToken");
	}
	
}
