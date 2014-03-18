/**
 * 
 */
package com.wechatoa.web.dao;

import java.util.List;

import com.wechatoa.web.vo.DeptVo;

/**
 * @author suilei
 * @date 2014年3月17日 下午6:32:46
 */
public interface IDeptDao {
	public int saveDept(DeptVo deptVo);
	public List<DeptVo> queryDeptByName(String deptName);
	public List<DeptVo> queryAllDept();
}
