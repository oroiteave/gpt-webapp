package org.gpt.webapp.core.facades;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.gpt.webapp.core.facades.impl.DefaultChatFacade;
import org.gpt.webapp.persistence.entities.Chat;
import org.gpt.webapp.persistence.entities.User;
import org.gpt.webapp.persistence.repositories.ChatRepository;
import org.gpt.webapp.persistence.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class ChatFacadeTest {
	@InjectMocks
	private DefaultChatFacade chatFacade;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ChatRepository chatRepository;
    
    private User testUser;
    private Chat testChat;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        
        testChat = new Chat();
        testChat.setId(1L);
        testChat.setTitle("testTitle");
        testChat.setUser(testUser);
    }
    
    @Test
    void testSaveChat() {
    	chatFacade.saveChat(testChat);
    	
    	verify(chatRepository,times(1)).save(testChat);
    }
    
    @Test
    void testShouldGetChatsByUserId() {
    	when(chatRepository.findByUserId(1L)).thenReturn(Optional.of(List.of(testChat)));
    	
    	List<Chat> foundChats = chatFacade.getChatsByUserId(1L);
    	
    	assertThat(foundChats).isNotNull();
    	assertThat(foundChats.get(0).getId()).isEqualTo(1L);
    	assertThat(foundChats.get(0).getTitle()).isEqualTo("testTitle");
    }
    
    @Test
    void testShouldGetChatById() {
    	when(chatRepository.findById(1L)).thenReturn(Optional.of(testChat));
    	
    	Chat foundChat = chatFacade.getChatById(1L);
    	
    	assertThat(foundChat).isNotNull();
    	assertThat(foundChat.getId()).isEqualTo(1L);
    	assertThat(foundChat.getTitle()).isEqualTo("testTitle");
    }
}
