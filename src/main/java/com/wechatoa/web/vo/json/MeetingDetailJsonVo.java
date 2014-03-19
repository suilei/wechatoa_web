/**
 * 
 */
package com.wechatoa.web.vo.json;

import java.io.Serializable;
import java.util.List;

import com.wechatoa.web.vo.EmployeeVo;
import com.wechatoa.web.vo.FileVo;
import com.wechatoa.web.vo.MeetingVo;

/**
 * @author suilei
 * @date 2014年3月19日 下午5:03:51
 */
public class MeetingDetailJsonVo implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private MeetingVo mv;
	private List<EmployeeVo> employeeList;
	private List<FileVo> fileList;
	public MeetingVo getMv() {
		return mv;
	}
	public void setMv(MeetingVo mv) {
		this.mv = mv;
	}
	public List<EmployeeVo> getEmployeeList() {
		return employeeList;
	}
	public void setEmployeeList(List<EmployeeVo> employeeList) {
		this.employeeList = employeeList;
	}
	public List<FileVo> getFileList() {
		return fileList;
	}
	public void setFileList(List<FileVo> fileList) {
		this.fileList = fileList;
	}
}
