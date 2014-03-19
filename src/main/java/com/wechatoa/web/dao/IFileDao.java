/**
 * 
 */
package com.wechatoa.web.dao;

import java.util.List;

import com.wechatoa.web.vo.FileVo;

/**
 * @author suilei
 * @date 2014年3月19日 下午2:06:54
 */
public interface IFileDao {
	public long saveFile(FileVo fileVo);
	public List<FileVo> queryFileByFileId(long fileId);
}
