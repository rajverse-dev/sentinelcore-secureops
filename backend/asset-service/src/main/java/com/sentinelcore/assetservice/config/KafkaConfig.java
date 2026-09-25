package com.sentinelcore.assetservice.config;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.listener.ContainerProperties;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.support.serializer.JsonSerializer;

import com.sentinelcore.assetservice.dto.AuditEventMessage;

@Configuration
@EnableKafka
@ConditionalOnProperty(name = "sentinelcore.kafka.enabled", havingValue = "true", matchIfMissing = true)
public class KafkaConfig {

    @Value("${spring.kafka.bootstrap-servers:localhost:9092}")
    private String bootstrapServers;

    @Value("${spring.kafka.consumer.group-id:sentinelcore-audit-group}")
    private String groupId;

    @Bean
    public ProducerFactory<String, Object> producerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        // Tolerate broker unavailability — don't block forever
        config.put(ProducerConfig.REQUEST_TIMEOUT_MS_CONFIG, 5000);
        config.put(ProducerConfig.DELIVERY_TIMEOUT_MS_CONFIG, 10000);
        config.put(ProducerConfig.MAX_BLOCK_MS_CONFIG, 5000);
        return new DefaultKafkaProducerFactory<>(config);
    }

    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }

    @Bean
    public ConsumerFactory<String, AuditEventMessage> consumerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        config.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        config.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        config.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        config.put(JsonDeserializer.TRUSTED_PACKAGES, "*");
        // Graceful reconnect — back off slowly instead of hammering the broker
        config.put(ConsumerConfig.RECONNECT_BACKOFF_MS_CONFIG, 1000);
        config.put(ConsumerConfig.RECONNECT_BACKOFF_MAX_MS_CONFIG, 10000);
        config.put(ConsumerConfig.REQUEST_TIMEOUT_MS_CONFIG, 15000);

        return new DefaultKafkaConsumerFactory<>(
                config,
                new StringDeserializer(),
                new JsonDeserializer<>(AuditEventMessage.class, false)
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, AuditEventMessage> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, AuditEventMessage> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        // Set poll timeout so the container doesn't hang indefinitely
        factory.getContainerProperties().setPollTimeout(3000);
        return factory;
    }
}
