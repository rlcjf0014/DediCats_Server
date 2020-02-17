import io from "socket.io";
import http from "http";


const socket = (app: http.Server): io.Server => {
    const exampleIo = io(app);

    exampleIo.on("connection", (sockets: { handshake: { query: { postId: any; }; }; postId: any; join: (arg0: any) => void; on: (arg0: string, arg1: () => void) => void; }) => {
        const { postId } = sockets.handshake.query;
        // eslint-disable-next-line no-param-reassign
        sockets.postId = postId;

        console.log("User connected to postID,", postId);
        sockets.join(postId);

        sockets.on("disconnect", () => {
            console.log("disconnected postID: ", postId);
        });
    });

    return exampleIo;
};

export default socket;
