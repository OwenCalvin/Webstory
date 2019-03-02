export namespace StoryResponse {
  export interface Owner {
    __typename: string;
    id: string;
    profile_pic_url: string;
    username: string;
    followed_by_viewer: boolean;
    requested_by_viewer: boolean;
  }

  export interface User {
    id: string;
    profile_pic_url: string;
    username: string;
    followed_by_viewer: boolean;
    requested_by_viewer: boolean;
  }

  export interface Dimensions {
    height: number;
    width: number;
  }

  export interface DisplayResource {
    src: string;
    config_width: number;
    config_height: number;
  }

  export interface Owner2 {
    id: string;
    profile_pic_url: string;
    username: string;
  }

  export interface VideoResource {
    src: string;
    config_width: number;
    config_height: number;
    mime_type: string;
    profile: string;
  }

  export interface TappableObject {
    __typename: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    custom_title ? : any;
    attribution ? : any;
    username: string;
    full_name: string;
    is_private: boolean;
  }

  export interface Item {
    __typename: string;
    id: string;
    dimensions: Dimensions;
    display_resources: DisplayResource[];
    display_url: string;
    media_preview: string;
    gating_info ? : any;
    taken_at_timestamp: number;
    expiring_at_timestamp: number;
    story_cta_url: string;
    story_view_count ? : any;
    is_video: boolean;
    owner: Owner2;
    should_log_client_event: boolean;
    tracking_token: string;
    overlay_image_resources ? : any;
    video_duration: number;
    video_resources: VideoResource[];
    tappable_objects: TappableObject[];
    story_app_attribution ? : any;
  }

  export interface ReelsMedia {
    __typename: string;
    id: string;
    latest_reel_media: number;
    can_reply: boolean;
    owner: Owner;
    expiring_at: number;
    can_reshare: boolean;
    seen ? : any;
    user: User;
    items: Item[];
  }

  export interface Data {
    reels_media: ReelsMedia[];
  }
}

export interface IStoryResponse {
  data: StoryResponse.Data;
  status: string;
}
