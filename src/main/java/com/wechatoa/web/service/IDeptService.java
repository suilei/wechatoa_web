/**
 * 
 */
package com.wechatoa.web.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.wechatoa.web.vo.DeptVo;

/**
 * @author suilei
 * @date 2014年3月18日 上午10:25:51
 */
@Service
public interface IDeptService {
	public int saveDept(DeptVo deptVo);
	public DeptVo queryByDeptName(String deptName);
	public List<DeptVo> queryAllDept();
}
