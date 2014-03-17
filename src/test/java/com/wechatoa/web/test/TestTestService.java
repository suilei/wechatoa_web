package com.wechatoa.web.test;


import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.wechatoa.web.service.ITestService;
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring-system-config.xml"})
@Transactional
public class TestTestService {

	@Autowired
	private ITestService userService;
	@Test
    public void testService() {  
        Assert.notNull(userService);  
    }  
//	@Test
//	public void testSave() {
//		userService.saveUser();
//	}

}
