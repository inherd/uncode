# Created by fdhuang at 2021/5/1
Feature: IDE Init flow design
  # Enter feature description here

  Scenario: Start IDE
    Given Uncode IDD
    When I open IDE
    Then I should saw last path
