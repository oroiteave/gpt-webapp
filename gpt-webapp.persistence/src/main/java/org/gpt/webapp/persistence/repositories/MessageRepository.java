package org.gpt.webapp.persistence.repositories;

import java.util.List;
import java.util.Optional;

import org.gpt.webapp.persistence.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message,Long>{
	Optional<List<Message>> findByChatIdOrderByEventTimestampAsc(Long chatId);
}
