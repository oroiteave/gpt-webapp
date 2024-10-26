package org.gpt.webapp.persistence.respositories;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.gpt.webapp.persistence.entities.Chat;
import org.gpt.webapp.persistence.entities.Message;
import org.gpt.webapp.persistence.entities.User;
import org.gpt.webapp.persistence.repositories.ChatRepository;
import org.gpt.webapp.persistence.repositories.MessageRepository;
import org.gpt.webapp.persistence.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
@DataJpaTest
public class MessageRepositoryTest {
	
	@Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MessageRepository messageRepository;

    private User testUser;

    private Chat testChat;
    
    private Message testMessage;
    
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
        testChat.setMessages(Collections.emptyList());
        chatRepository.save(testChat);
        
        testMessage = new Message();
        testMessage.setContent("hola mundo");
        testMessage.setTotalTokens(2);
        testMessage.setChat(testChat);
        testMessage.setRole("user");
        messageRepository.save(testMessage);
    }

    @Test
    void testSaveMessage() {
    	Optional<Message> foundMessage = messageRepository.findById(testMessage.getId());
    	assertThat(foundMessage.isPresent());
    	assertThat(foundMessage.get().getId()).isGreaterThan(0);
    	assertThat(foundMessage.get().getContent()).isEqualTo("hola mundo");
    	assertThat(foundMessage.get().getTotalTokens()).isEqualTo(2);
    	assertThat(foundMessage.get().getEventTimestamp()).isNotNull();
    	assertThat(foundMessage.get().getRole()).isNotNull();
    	assertThat(foundMessage.get().getChat()).isEqualTo(testChat);
    }
    
    @Test
    void testShouldFindMessagesByChatId() {
    	Optional<List<Message>> foundMessage = messageRepository.findByChatIdOrderByEventTimestampAsc(testChat.getId());
    	assertThat(foundMessage.isPresent());
    	assertThat(foundMessage.get().get(0).getId()).isGreaterThan(0);
    	assertThat(foundMessage.get().get(0).getContent()).isEqualTo("hola mundo");
    	assertThat(foundMessage.get().get(0).getTotalTokens()).isEqualTo(2);
    	assertThat(foundMessage.get().get(0).getEventTimestamp()).isNotNull();
    	assertThat(foundMessage.get().get(0).getRole()).isNotNull();
    	assertThat(foundMessage.get().get(0).getChat()).isEqualTo(testChat);
    }
}
