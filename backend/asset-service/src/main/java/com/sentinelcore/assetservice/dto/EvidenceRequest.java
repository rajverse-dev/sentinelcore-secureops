package com.sentinelcore.assetservice.dto;
public class EvidenceRequest {
    private String evidenceType; private String description;
    private String reference; private String status;
    public String getEvidenceType(){return evidenceType;} public void setEvidenceType(String v){evidenceType=v;}
    public String getDescription(){return description;} public void setDescription(String v){description=v;}
    public String getReference(){return reference;} public void setReference(String v){reference=v;}
    public String getStatus(){return status;} public void setStatus(String v){status=v;}
}
