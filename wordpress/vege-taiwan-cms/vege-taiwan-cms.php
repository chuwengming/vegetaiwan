<?php
/**
 * Plugin Name:       Vege Taiwan CMS
 * Description:       蔬食台灣促進會 — ACF 側邊欄配置、補充欄位、聯絡資訊（Headless GraphQL）
 * Version:           1.2.1
 * Author:            Vege Taiwan
 * Requires Plugins:  advanced-custom-fields, wp-graphql, wpgraphql-acf
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Move Activity / Promotion ACF field groups to the editor sidebar.
 */
function vege_taiwan_acf_sidebar_field_groups( $field_group ) {
	$sidebar_groups = array(
		'group_69be6fbbc52e2', // 活動詳細資訊
		'group_69be799b85a42', // 文宣素材資訊
	);

	if ( in_array( $field_group['key'], $sidebar_groups, true ) ) {
		$field_group['position']   = 'side';
		$field_group['menu_order'] = 0;
	}

	return $field_group;
}
add_filter( 'acf/load_field_group', 'vege_taiwan_acf_sidebar_field_groups' );

/**
 * Merge supplemental fields into existing field groups (avoids GraphQL type conflicts).
 */
function vege_taiwan_merge_supplemental_fields( $field_group ) {
	if ( 'group_69be6fbbc52e2' === $field_group['key'] ) {
		$field_group['fields'][] = array(
			'key'                => 'field_vege_event_end_date',
			'label'              => '活動結束日期時間',
			'name'               => 'event_end_date',
			'type'               => 'date_time_picker',
			'display_format'     => 'Y-m-d H:i',
			'return_format'      => 'Y-m-d H:i',
			'show_in_graphql'    => 1,
			'graphql_field_name' => 'eventEndDate',
		);
	}

	if ( 'group_69be799b85a42' === $field_group['key'] ) {
		$field_group['fields'][] = array(
			'key'                => 'field_vege_pdf_file',
			'label'              => 'PDF 檔案',
			'name'               => 'pdf_file',
			'type'               => 'file',
			'return_format'      => 'id',
			'mime_types'         => 'pdf',
			'show_in_graphql'    => 1,
			'graphql_field_name' => 'pdfFile',
		);
	}

	return $field_group;
}
add_filter( 'acf/load_field_group', 'vege_taiwan_merge_supplemental_fields', 15 );

/**
 * Site contact options page + fields.
 */
function vege_taiwan_register_site_contact() {
	if ( ! function_exists( 'acf_add_local_field_group' ) ) {
		return;
	}

	if ( function_exists( 'acf_add_options_page' ) ) {
		acf_add_options_page(
			array(
				'page_title'          => '網站聯絡資訊',
				'menu_title'          => '網站聯絡資訊',
				'menu_slug'           => 'vege-site-contact',
				'capability'          => 'edit_posts',
				'redirect'            => false,
				'show_in_graphql'     => 1,
				'graphql_single_name' => 'VegeSiteContact',
			)
		);
	}

	acf_add_local_field_group(
		array(
			'key'                => 'group_vege_site_contact',
			'title'              => '聯絡資訊',
			'fields'             => array(
				array(
					'key'                => 'field_vege_contact_address',
					'label'              => '聯絡地址',
					'name'               => 'contact_address',
					'type'               => 'text',
					'show_in_graphql'    => 1,
					'graphql_field_name' => 'contactAddress',
				),
				array(
					'key'                => 'field_vege_contact_phone',
					'label'              => '服務專線',
					'name'               => 'contact_phone',
					'type'               => 'text',
					'show_in_graphql'    => 1,
					'graphql_field_name' => 'contactPhone',
				),
				array(
					'key'                => 'field_vege_contact_email',
					'label'              => '電子信箱',
					'name'               => 'contact_email',
					'type'               => 'email',
					'show_in_graphql'    => 1,
					'graphql_field_name' => 'contactEmail',
				),
			),
			'location'           => array(
				array(
					array(
						'param'    => 'options_page',
						'operator' => '==',
						'value'    => 'vege-site-contact',
					),
				),
			),
			'show_in_graphql'    => 1,
			'graphql_field_name' => 'siteContactFields',
		)
	);
}
add_action( 'acf/init', 'vege_taiwan_register_site_contact' );

/**
 * Persist sidebar position to DB once.
 */
function vege_taiwan_persist_sidebar_position() {
	if ( get_option( 'vege_taiwan_sidebar_v120' ) || ! function_exists( 'acf_update_field_group' ) ) {
		return;
	}

	foreach ( array( 'group_69be6fbbc52e2', 'group_69be799b85a42' ) as $key ) {
		$group = acf_get_field_group( $key );
		if ( $group ) {
			$group['position'] = 'side';
			acf_update_field_group( $group );
		}
	}

	update_option( 'vege_taiwan_sidebar_v120', 1 );
}
add_action( 'acf/init', 'vege_taiwan_persist_sidebar_position', 20 );

/**
 * Seed pages when missing.
 */
function vege_taiwan_seed_content() {
	if ( get_option( 'vege_taiwan_v110_seeded' ) || ! function_exists( 'update_field' ) ) {
		return;
	}

	foreach ( array( 'about', 'contact' ) as $slug ) {
		if ( ! get_page_by_path( $slug, OBJECT, 'page' ) ) {
			wp_insert_post(
				array(
					'post_title'   => $slug === 'about' ? '關於社團' : '聯絡我們',
					'post_name'    => $slug,
					'post_content' => $slug === 'about'
						? '<p>蔬食台灣促進會致力於推廣全民蔬食，建立和平及綠色環保的社會。</p>'
						: '<p>有任何建議或合作機會？歡迎與我們聯繫。</p>',
					'post_status'  => 'publish',
					'post_type'    => 'page',
				)
			);
		}
	}

	update_field( 'contact_address', '台北市中正區蔬食路 108 號 5 樓', 'option' );
	update_field( 'contact_phone', '02-1234-5678', 'option' );
	update_field( 'contact_email', 'contact@vegetaiwan.org', 'option' );

	update_option( 'vege_taiwan_v110_seeded', 1 );
}
add_action( 'admin_init', 'vege_taiwan_seed_content' );
