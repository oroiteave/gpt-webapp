package org.gpt.webapp.core.facades;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import org.gpt.webapp.core.facades.impl.DefaultMessageFacade;
import org.gpt.webapp.persistence.entities.Chat;
import org.gpt.webapp.persistence.entities.Message;
import org.gpt.webapp.persistence.entities.User;
import org.gpt.webapp.persistence.repositories.ChatRepository;
import org.gpt.webapp.persistence.repositories.MessageRepository;
import org.gpt.webapp.persistence.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class MessageFacadeTest {
	
	@InjectMocks
	private DefaultMessageFacade messageFacade;
	
	@Mock
    private UserRepository userRepository;

    @Mock
    private ChatRepository chatRepository;
    
    @Mock
    private MessageRepository messageRepository;
    
    private User testUser;
    private Chat testChat;
    private Message testMessage;
    
    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        
        testChat = new Chat();
        testChat.setId(1L);
        testChat.setTitle("testTitle");
        testChat.setUser(testUser);
        
        testMessage = new Message();
        testMessage.setId(1L);
        testMessage.setChat(testChat);
        testMessage.setContent("testContent");
    }
    
    @Test
    void saveMessage() {
    	messageFacade.saveMessage(testMessage);
    	
    	verify(messageRepository,times(1)).save(testMessage);
    }
	
}
