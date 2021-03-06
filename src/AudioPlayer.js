import RealTimeBPMAnalyzer from 'realtime-bpm-analyzer'

import { useState } from 'react'

function initAnalyzer(audio, setBpm) {
    // Create new instance of AudioContext
    const audioContext = new AudioContext();
    // Set the source with the HTML Audio Node
    const source = audioContext.createMediaElementSource(audio);
    // Set the scriptProcessorNode to get PCM data in real time
    const scriptProcessorNode = audioContext.createScriptProcessor(4096, 1, 1);
    // Connect everythings together
    scriptProcessorNode.connect(audioContext.destination);
    source.connect(scriptProcessorNode);
    source.connect(audioContext.destination);

    const onAudioProcess = new RealTimeBPMAnalyzer({
        scriptNode: {
            bufferSize: 4096,
            numberOfInputChannels: 1,
            numberOfOutputChannels: 1
        },
        pushTime: 2000,
        pushCallback: (err, bpm) => {
            if (bpm){
                setBpm(bpm)
            }
        }
    });
    // Attach realTime function to audioprocess event.inputBuffer (AudioBuffer)
    scriptProcessorNode.onaudioprocess = (e) => {
        onAudioProcess.analyze(e);
    };
}

function AudioPlayer(){
    const [Info, setInfo] = useState('')
    const [bpm, setBpm] = useState()

    function handleLoadAudioSource (e){
        let file = e.target.files[0]
        setInfo(file.name)
        let audio = document.getElementById('track')
        let src = URL.createObjectURL(file)
        audio.setAttribute("src", src)

        initAnalyzer(audio, setBpm)
    }

    let AddFile = ()=>(<div>
        <input type="file" id="audio_source" accept="audio/mp3"
        hidden 
        onInput={handleLoadAudioSource}
        ></input>
        <label htmlFor="audio_source" 
        style={{fontSize: '50px', fontWeight:'bold'}}
        >+</label>
    </div>)
    
    return (
        <div>
            <AddFile/>
            <div id="file_list"
            style={{borderRadius: '5px', 
            borderColor: 'white',background: 'white', color: 'black'}}
            >
            </div>

            <audio id="track" controls autoPlay crossOrigin="anonymous"
            ></audio>

            <div id="print">
                <p>{Info}</p>
                BPM: {bpm ? bpm.map((v,i) => <span key={i.toString()}>{v.tempo} </span>) : 0}
                <p>
                Best: {bpm ? bpm.reduce((a,b) =>(a.count>b.count? a:b)).tempo: 0}
                </p>
            </div>
        </div>
    )
}

export default AudioPlayer