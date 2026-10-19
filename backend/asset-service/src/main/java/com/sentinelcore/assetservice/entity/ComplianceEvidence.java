package com.sentinelcore.assetservice.entity;
import java.time.LocalDateTime;
 import java.util.UUID;

 import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
@Entity @Table(name="compliance_evidence") public class ComplianceEvidence {
 @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id; @ManyToOne(optional=false,fetch=FetchType.LAZY) private ComplianceControl control; private String evidenceType; @Column(length=4000) private String description; private String reference; private String status; private LocalDateTime createdAt; private LocalDateTime reviewedAt;
 @PrePersist void onCreate(){if(createdAt==null)createdAt=LocalDateTime.now();} public UUID getId(){return id;} public void setId(UUID id){this.id=id;} public ComplianceControl getControl(){return control;} public void setControl(ComplianceControl v){control=v;} public String getEvidenceType(){return evidenceType;} public void setEvidenceType(String v){evidenceType=v;} public String getDescription(){return description;} public void setDescription(String v){description=v;} public String getReference(){return reference;} public void setReference(String v){reference=v;} public String getStatus(){return status;} public void setStatus(String v){status=v;} public LocalDateTime getCreatedAt(){return createdAt;} public LocalDateTime getReviewedAt(){return reviewedAt;}
}