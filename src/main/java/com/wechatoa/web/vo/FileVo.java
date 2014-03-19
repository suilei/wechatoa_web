/**
 * 
 */
package com.wechatoa.web.vo;

import java.io.Serializable;

/**
 * @author suilei
 * @date 2014年3月19日 下午2:04:43
 */
public class FileVo implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private long fileId;
	private String fileName;
	private double fileSize;
	private String fileType;
	private String fileUrl;
	private int fileValid;
	public long getFileId() {
		return fileId;
	}
	public void setFileId(long fileId) {
		this.fileId = fileId;
	}
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public double getFileSize() {
		return fileSize;
	}
	public void setFileSize(double fileSize) {
		this.fileSize = fileSize;
	}
	public String getFileType() {
		return fileType;
	}
	public void setFileType(String fileType) {
		this.fileType = fileType;
	}
	public String getFileUrl() {
		return fileUrl;
	}
	public void setFileUrl(String fileUrl) {
		this.fileUrl = fileUrl;
	}
	public int getFileValid() {
		return fileValid;
	}
	public void setFileValid(int fileValid) {
		this.fileValid = fileValid;
	}
}
