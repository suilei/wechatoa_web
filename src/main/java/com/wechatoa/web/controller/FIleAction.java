/**
 * 
 */
package com.wechatoa.web.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.wechatoa.web.service.IFileService;
import com.wechatoa.web.vo.FileVo;

/**
 * @author suilei
 * @date 2014年3月19日 下午2:26:37
 */
@Controller
@RequestMapping("/file")
public class FIleAction {
	@Autowired
	private IFileService fileService;
	
	@RequestMapping("/addFile")
	public String addFile(FileVo fileVo, ModelMap map,
	        HttpServletRequest request, HttpServletResponse response){
		System.out.println("fileService:" + fileService);
		fileService.addFile(fileVo);
		map.put("name", fileVo.getFileName());
		return "jsp/success/success";
	}
}
