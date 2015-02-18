var TeaLogger = require("../src/index");

TeaLogger.getByName("hello-world");
TeaLogger.getByName("hoge");
TeaLogger.getByName("hoge/fuga");
TeaLogger.getByName("my-component-one");
TeaLogger.getByName("my-component-two");
TeaLogger.getByName("I love ES6 Modules");

TeaLogger.debugMode = true;
TeaLogger.showConfigurationView();
