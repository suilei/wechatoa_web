/**
 * 
 */
package com.wechatoa.web.service;

import org.springframework.stereotype.Service;

import com.wechatoa.web.vo.MeetingVo;

/**
 * @author suilei
 * @date 2014年3月18日 下午4:54:59
 */
@Service
public interface IMeetingService {
	public long addMeeting(MeetingVo mv);
}
