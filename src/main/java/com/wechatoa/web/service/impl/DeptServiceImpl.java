/**
 * 
 */
package com.wechatoa.web.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wechatoa.web.dao.impl.DeptDaoImpl;
import com.wechatoa.web.service.IDeptService;
import com.wechatoa.web.vo.DeptVo;

/**
 * @author suilei
 * @date 2014年3月18日 上午10:29:11
 */
@Transactional
@Service
public class DeptServiceImpl implements IDeptService{

	@Autowired
	private DeptDaoImpl deptDao;
	
	@Override
	public int saveDept(DeptVo deptVo) {
		int key = deptDao.saveDept(deptVo);
		return key;
	}

	@Override
	public DeptVo queryByDeptName(String deptName) {
		List<DeptVo> list = deptDao.queryDeptByName(deptName);
		if (list != null && list.size() > 0) {
			return list.get(0);
		}
		return null;
	}

	@Override
	public List<DeptVo> queryAllDept() {
		List<DeptVo> list = deptDao.queryAllDept();
		return list;
	}

}
