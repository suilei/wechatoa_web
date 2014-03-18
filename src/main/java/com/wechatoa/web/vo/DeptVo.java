/**
 * 
 */
package com.wechatoa.web.vo;

import java.io.Serializable;

/**
 * @author suilei
 * @date 2014年3月17日 下午6:27:29
 */
public class DeptVo implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private int deptId;
	private String deptName;
	private String deptDesc;
	public int getDeptId() {
		return deptId;
	}
	public void setDeptId(int deptId) {
		this.deptId = deptId;
	}
	public String getDeptName() {
		return deptName;
	}
	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}
	public String getDeptDesc() {
		return deptDesc;
	}
	public void setDeptDesc(String deptDesc) {
		this.deptDesc = deptDesc;
	}
	
}
