package com.sentinelcore.assetservice.entity;
import java.time.LocalDateTime;
 import java.util.UUID;

 import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
@Entity @Table(name="compliance_controls") public class ComplianceControl {
 @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id; @ManyToOne(optional=false,fetch=FetchType.LAZY) private ComplianceFramework framework; @Column(nullable=false) private String controlId; @Column(nullable=false) private String title; private String description; @Enumerated(EnumType.STRING) private ComplianceStatus status=ComplianceStatus.NOT_ASSESSED; private String owner; private LocalDateTime lastReviewedAt; private LocalDateTime nextReviewAt;
 public UUID getId(){return id;} public void setId(UUID id){this.id=id;} public ComplianceFramework getFramework(){return framework;} public void setFramework(ComplianceFramework framework){this.framework=framework;} public String getControlId(){return controlId;} public void setControlId(String controlId){this.controlId=controlId;} public String getTitle(){return title;} public void setTitle(String title){this.title=title;} public String getDescription(){return description;} public void setDescription(String description){this.description=description;} public ComplianceStatus getStatus(){return status;} public void setStatus(ComplianceStatus status){this.status=status;} public String getOwner(){return owner;} public void setOwner(String owner){this.owner=owner;} public LocalDateTime getLastReviewedAt(){return lastReviewedAt;} public void setLastReviewedAt(LocalDateTime v){lastReviewedAt=v;} public LocalDateTime getNextReviewAt(){return nextReviewAt;} public void setNextReviewAt(LocalDateTime v){nextReviewAt=v;}
}