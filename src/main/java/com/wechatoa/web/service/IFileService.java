/**
 * 
 */
package com.wechatoa.web.service;

import org.springframework.stereotype.Service;

import com.wechatoa.web.vo.FileVo;

/**
 * @author suilei
 * @date 2014年3月19日 下午2:16:18
 */
@Service
public interface IFileService {
	public long addFile(FileVo fileVo);
	public FileVo queryFileByFileId(long fileId);
}
