/**
 * 
 */
package com.wechatoa.web.dao.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Component;

import com.wechatoa.web.dao.IFileDao;
import com.wechatoa.web.dao.base.AbstractBaseDao;
import com.wechatoa.web.vo.FileVo;

/**
 * @author suilei
 * @date 2014年3月19日 下午2:08:32
 */
@Component("fileDao")
public class FileDaoImpl extends AbstractBaseDao<Object> implements IFileDao {

	/* (non-Javadoc)
	 * @see com.wechatoa.web.dao.IFileDao#saveFile(com.wechatoa.web.vo.FileVo)
	 */
	@Override
	public long saveFile(final FileVo fileVo) {
		KeyHolder keyHolder = new GeneratedKeyHolder();  
		final String sql = "insert into t_file(f_name,f_size,f_type,f_url,f_valid) "
				+ "values(?,?,?,?,?)";
	    getJdbcTemplate().update(new PreparedStatementCreator() {
			public PreparedStatement createPreparedStatement(
					Connection connection) throws SQLException {
				PreparedStatement ps = connection.prepareStatement(sql,
						Statement.RETURN_GENERATED_KEYS);
				ps.setString(1, fileVo.getFileName());
				ps.setDouble(2, fileVo.getFileSize());
				ps.setString(3, fileVo.getFileType());
				ps.setString(4, fileVo.getFileUrl());
				ps.setInt(5, fileVo.getFileValid());
				return ps;
			}
	    }, keyHolder);
	    return keyHolder.getKey().longValue();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<FileVo> queryFileByFileId(long fileId) {
		String sql = "select * from t_file where f_id = ?";  
		System.out.println("fileId:" + fileId);
        List<FileVo> list = this.getJdbcTemplate().query(sql,  
                new Object[] { fileId }, new FileMapper()); 
        System.out.println("list:" + list);
        return list; 
	}
	
	@SuppressWarnings("rawtypes")
	private class FileMapper implements RowMapper {  
        public Object mapRow(ResultSet rs, int i) throws SQLException {  
        	FileVo vo = new FileVo(); 
        	vo.setFileId(rs.getLong("f_id"));
        	vo.setFileName(rs.getString("f_name"));
        	vo.setFileSize(rs.getDouble("f_size"));
        	vo.setFileType(rs.getString("f_type"));
        	vo.setFileUrl(rs.getString("f_url"));
        	vo.setFileValid(rs.getInt("f_valid"));
            return vo;  
        }  
    }
}
