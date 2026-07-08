import Fullscreen from '@mui/icons-material/Fullscreen';
import FullscreenExit from '@mui/icons-material/FullscreenExit';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import React, { useCallback, useState } from 'react';

import { playbackManager } from 'components/playback/playbackmanager';

const FullscreenButton = () => {
    const [ isFullscreen, setIsFullscreen ] = useState(false);

    const handleFullscreen = useCallback(() => {
        const player = playbackManager.getCurrentPlayer();
        if (player) {
            playbackManager.toggleFullscreen(player);
            setIsFullscreen(!isFullscreen);
        }
    }, [ isFullscreen ]);

    return (
        <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
            <IconButton
                size='large'
                aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                onClick={handleFullscreen}
                color='inherit'
            >
                {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
        </Tooltip>
    );
};

export default FullscreenButton;
