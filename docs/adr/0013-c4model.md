# 13. c4model

日期: 2021-05-09

## 状态

2021-05-09 提议

## 背景

from: [https://structurizr.com/dsl?example=getting-started](https://structurizr.com/dsl?example=getting-started)

```
workspace "Getting Started" "This is a model of my software system." {

    model {
        user = person "User" "A user of my software system."
        softwareSystem = softwareSystem "Software System" "My software system."

        user -> softwareSystem "Uses"
    }

    views {
        systemContext softwareSystem "SystemContext" "An example of a System Context diagram." {
            include *
            autoLayout
        }

        styles {
            element "Software System" {
                background #1168bd
                color #ffffff
            }
            element "Person" {
                shape person
                background #08427b
                color #ffffff
            }
        }
    }
}
```

## 决策

在这里补充上决策信息...

## 后果

在这里记录结果...
