import React, { useContext, useEffect } from "react";
import { Page } from "../layout/Page";;
import styles from "./EventPage.scss";
import { AuthContext } from "../auth/AuthContext";
import { usePublicRooms } from "../home/usePublicRooms";
import { MediaGrid } from "../home/MediaGrid";
import { RoomTile } from "../home/RoomTile";

export function EventPage() {
  const auth = useContext(AuthContext);
  const { results: publicRooms } = usePublicRooms();
	const featuredRooms = Array.from(new Set([...publicRooms])).sort(
    (a, b) => b.member_count - a.member_count
  );
  useEffect(() => {
    const qs = new URLSearchParams(location.search);

    // Support legacy sign in urls.
    if (qs.has("sign_in")) {
      const redirectUrl = new URL("/signin", window.location);
      redirectUrl.search = location.search;
      window.location = redirectUrl;
    } else if (qs.has("auth_topic")) {
      const redirectUrl = new URL("/verify", window.location);
      redirectUrl.search = location.search;
      window.location = redirectUrl;
    } else if (qs.has("join")) {
      const redirectUrl = new URL("/hub", window.location);
      redirectUrl.search = location.search;
      window.location = redirectUrl;
    }
  }, []);
  return (
    <Page className={styles.homePage}>
		{featuredRooms.length > 0 && (
			<div style={{width:"100%"}}>
				<section className={styles.roomsTitle}>
					<h3>Rooms</h3>
				</section>
				<section className={styles.featuredRooms}>
					<MediaGrid>{featuredRooms.map(room => <RoomTile key={room.id} room={room} />)}</MediaGrid>
				</section>
			</div>
		)}
    </Page>
  );
}
