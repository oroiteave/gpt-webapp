package org.gpt.webapp.core.facades;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.gpt.webapp.core.facades.impl.DefaultUserFacade;
import org.gpt.webapp.persistence.entities.User;
import org.gpt.webapp.persistence.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class UserFacadeTest {
	
	@InjectMocks
    private DefaultUserFacade userFacade;

    @Mock
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUserName("testuser");
        testUser.setEmail("testuser@example.com");
        testUser.setPassword("password123");
    }

    @Test
    void testSaveUser() {
        userFacade.saveUser(testUser);

        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void testGetUserById() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        User foundUser = userFacade.getUserById(1L).get();

        assertThat(foundUser).isNotNull();
        assertThat(foundUser.getId()).isEqualTo(1L);
        assertThat(foundUser.getUserName()).isEqualTo("testuser");
    }

    @Test
    void testGetUserByUserName() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        User foundUser = userFacade.getUserByUserName("testuser").get();

        assertThat(foundUser).isNotNull();
        assertThat(foundUser.getUserName()).isEqualTo("testuser");
        assertThat(foundUser.getEmail()).isEqualTo("testuser@example.com");
    }
    
    @Test
    void testGetUserByEmail() {
    	when(userRepository.findByEmail("testuser@example.com")).thenReturn(Optional.of(testUser));
    	
    	User foundUser = userFacade.getUserByEmail("testuser@example.com").get();

        assertThat(foundUser).isNotNull();
        assertThat(foundUser.getId()).isEqualTo(1L);
        assertThat(foundUser.getUserName()).isEqualTo("testuser");
        assertThat(foundUser.getEmail()).isEqualTo("testuser@example.com");
    }
}
