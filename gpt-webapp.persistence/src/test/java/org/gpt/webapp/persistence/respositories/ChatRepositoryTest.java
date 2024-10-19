package org.gpt.webapp.persistence.respositories;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.gpt.webapp.persistence.entities.Chat;
import org.gpt.webapp.persistence.entities.User;
import org.gpt.webapp.persistence.repositories.ChatRepository;
import org.gpt.webapp.persistence.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
@DataJpaTest
public class ChatRepositoryTest {
	@Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    private User testUser;
    
    private Chat testChat;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setEmail("test@example.com");
        testUser.setPassword("password");
        testUser.setUserName("testUser");
        userRepository.save(testUser);
        
        testChat = new Chat();
        testChat.setUser(testUser);
        testChat.setTitle("My First Chat");
        testChat.setModel("modelTest");
        testChat.setMessages(Collections.emptyList()); 
        chatRepository.save(testChat);
    }

    @Test
    void testSaveChat() {
        Optional<Chat> findChat = chatRepository.findById(testChat.getId()); 
        assertThat(findChat.get()).isNotNull();
        assertThat(findChat.get().getId()).isGreaterThan(0);
        assertThat(findChat.get().getUser()).isEqualTo(testUser);
        assertThat(findChat.get().getTitle()).isEqualTo("My First Chat");
        assertThat(findChat.get().getModel()).isEqualTo("modelTest");
        assertThat(findChat.get().getMessages()).isEmpty();
    }
    
	@Test
	void testShouldFoundChatByUserId() {
		Optional<List<Chat>> findChat = chatRepository.findByUserId(testUser.getId());
		assertThat(findChat.get()).isNotNull();
		assertThat(findChat.get().get(0).getId()).isGreaterThan(0);
		assertThat(findChat.get().get(0).getUser()).isEqualTo(testUser);
        assertThat(findChat.get().get(0).getTitle()).isEqualTo("My First Chat");
        assertThat(findChat.get().get(0).getModel()).isEqualTo("modelTest");
        assertThat(findChat.get().get(0).getMessages()).isEmpty();
	}

}
