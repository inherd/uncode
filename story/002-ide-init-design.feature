# status: doing
Feature: IDE Init flow design
  打开 IDE 时，能读取上次打开的路径，并将结果传给 IDE

  Scenario: Start IDE
    Given Uncode IDD
    When I open IDE
    Then I should saw last path
