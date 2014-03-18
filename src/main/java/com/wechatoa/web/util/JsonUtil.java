/**
 *  Copyright (c)  2011-2020 Panguso, Inc.
 *  All rights reserved.
 *
 *  This software is the confidential and proprietary information of Panguso, 
 *  Inc. ("Confidential Information"). You shall not
 *  disclose such Confidential Information and shall use it only in
 *  accordance with the terms of the license agreement you entered into with Panguso.
 */
package com.wechatoa.web.util;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.SerializationConfig.Feature;


/**
 * Json工具类
 * 
 * @author sui lei
 * @date 2013-7-6
 */
public final class JsonUtil extends ObjectMapper {
	/**
	 * 
	 */
	public JsonUtil() {
		super();
	}

	private boolean autoDetectIsGetters = false;

	/**
	 * @return the autoDetectIsGetters
	 */
	public boolean isAutoDetectIsGetters() {
		return this.autoDetectIsGetters;
	}
	/**
	 * 
	 * @param jsonObj jsonObj
	 * @param key key
	 * @return
	 * @author sui lei
	 * @date 2013-8-23
	 */
	public static Double getDoubleVal(JSONObject jsonObj, String key) {
		if (jsonObj == null || key == null) {
			return null;
		}
		if (jsonObj.containsKey(key)) {
			return jsonObj.getDouble(key);
		}
		return null;
	}
	/**
	 * 
	 * @param jsonObj jsonObj
	 * @param key key
	 * @return
	 * @author sui lei
	 * @date 2013-8-23
	 */
	public static Integer getIntVal(JSONObject jsonObj, String key) {
		if (jsonObj == null || key == null) {
			return null;
		}
		if (jsonObj.containsKey(key)) {
			return jsonObj.getInt(key);
		}
		return null;
	}
	/**
	 * 
	 * @param jsonObj jsonObj
	 * @param key key
	 * @return
	 * @author sui lei
	 * @date 2013-8-23
	 */
	public static String getStrVal(JSONObject jsonObj, String key) {
		if (jsonObj == null || key == null) {
			return null;
		}
		if (jsonObj.containsKey(key)) {
			return jsonObj.getString(key);
		}
		return null;
	}
	/**
	 * @param autoDetectIsGetters the autoDetectIsGetters to set
	 */
	public void setAutoDetectIsGetters(boolean autoDetectIsGetters) {
		this.autoDetectIsGetters = autoDetectIsGetters;
		this.configure(Feature.AUTO_DETECT_IS_GETTERS, autoDetectIsGetters);
		// .getSerializationConfig().disable(SerializationConfig.Feature.AUTO_DETECT_IS_GETTERS);
	}
	/**
	 * 
	 * @param jsonObj jsonObj
	 * @param key key
	 * @return
	 * @author sui lei
	 * @date 2013-8-23
	 */
	public static JSONArray getArrayVal(JSONObject jsonObj, String key) {
		if (jsonObj == null || key == null) {
			return null;
		}
		if (jsonObj.containsKey(key) && (jsonObj.get(key) instanceof JSONArray)) {
			return jsonObj.getJSONArray(key);
		}
		return null;
	}
}
