package com.sentinelcore.assetservice.service;

import java.util.List;

public interface SonarQubeClient {

    List<SonarQubeIssue> fetchSecurityIssues(String projectKey);
}
