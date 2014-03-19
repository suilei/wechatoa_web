/**
 * 
 */
package com.wechatoa.web.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wechatoa.web.dao.impl.FileDaoImpl;
import com.wechatoa.web.service.IFileService;
import com.wechatoa.web.vo.FileVo;

/**
 * @author suilei
 * @date 2014年3月19日 下午2:21:47
 */
@Transactional
@Service
public class FileServiceImpl implements IFileService {

	@Autowired
	private FileDaoImpl fileDao;
	/* (non-Javadoc)
	 * @see com.wechatoa.web.dao.impl.IFileService#addFile(com.wechatoa.web.vo.FileVo)
	 */
	@Override
	public long addFile(FileVo fileVo) {
		long key = fileDao.saveFile(fileVo);
		return key;
	}
	@Override
	public FileVo queryFileByFileId(long fileId) {
		List<FileVo> list = fileDao.queryFileByFileId(fileId);
		if (list != null) {
			return list.get(0);
		}
		return new FileVo();
	}

}
